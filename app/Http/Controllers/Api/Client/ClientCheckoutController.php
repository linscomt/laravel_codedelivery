<?php

namespace CodeDelivery\Http\Controllers\Api\Client;

use CodeDelivery\Http\Controllers\Controller;
use CodeDelivery\Http\Requests;
use CodeDelivery\Repositories\OrderRepository;
use CodeDelivery\Repositories\ProductRepository;
use CodeDelivery\Repositories\UserRepository;
use CodeDelivery\Services\OrderService;
use Illuminate\Http\Request;
use LucaDegasperi\OAuth2Server\Facades\Authorizer;

class ClientCheckoutController extends Controller
{
    /**
     * @var OrderRepository
     */
    private $orderRepository;
    /**
     * @var UserRepository
     */
    private $userRepository;
    /**
     * @var ProductRepository
     */
    private $productRepository;
    /**
     * @var OrderService
     */
    private $orderService;

    public function __construct(
        OrderRepository $orderRepository,
        UserRepository $userRepository,
        ProductRepository $productRepository,
        OrderService $orderService
    )
    {
        $this->orderRepository = $orderRepository;
        $this->userRepository = $userRepository;
        $this->productRepository = $productRepository;
        $this->orderService = $orderService;
    }

    public function index()
    {
        $id = Authorizer::getResourceOwnerId();
        $clientId = $this->userRepository->find($id)->client->id;
        $orders =  $this->orderRepository->with(['items'])->scopeQuery(function($query) use($clientId){
            return $query->where('client_id','=', $clientId);
        })->paginate();

        return $orders;
    }

    public function show($id)
    {
        $order = $this->orderRepository->with(['client', 'items', 'cupom'])->find($id);
        $order->items->each(function ($item) {
            $item->product;
        });

        return $order;
    }
    public function store(Request $request)
    {

        $id = Authorizer::getResourceOwnerId();
        $data = $request->all();
        $clientId = $this->userRepository->find($id)->client->id;
        $data['client_id'] = $clientId;
        $order = $this->orderService->create($data);
        $order = $this->orderRepository->with(['items'])->find($order->id);

        return $order;
    }

}